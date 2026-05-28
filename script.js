document.addEventListener("DOMContentLoaded", () => {

    let scannerInstance = null;
    let mediaStream = null;
    let mediaRecorder = null;
    let recordedChunks = [];
    let timerInterval = null;
    let activeOrderId = "";
    let isProcessingScan = false;

    const elLanding = document.getElementById("landing");
    const elReaderContainer = document.getElementById("reader-container");
    const elRcrdStation = document.getElementById("rcrd-station");
    const elOrderLabel = document.getElementById("order-label");
    const elPreview = document.getElementById("preview");
    const elPreviewWrapper = document.getElementById("preview-wrapper");
    const elRecTimer = document.getElementById("rec-timer");
    const elDoneBtn = document.getElementById("done");
    const elScannerBtn = document.getElementById("scannerBtn");

    function startScanner() {
        isProcessingScan = false;

        elLanding.style.display = "none";
        elRcrdStation.style.display = "none";
        elReaderContainer.style.display = "block";

        try { Html5Qrcode.clear("reader"); } catch (_) {}
        scannerInstance = new Html5Qrcode("reader");

        const cameraConfig = { facingMode: "environment" };
        const scanConfig = {
            fps: 60,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
                const width = Math.min(viewfinderWidth * 0.9, 320);
                const height = Math.min(110, Math.floor(viewfinderHeight * 0.4));
                return { width: width, height: height };
            },
            formatsToSupport: [
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39
            ]
        };

        scannerInstance.start(
            cameraConfig,
            scanConfig,
            handleSuccessfulScan
        ).catch(handleScannerError);
    }

    function handleSuccessfulScan(decodedText) {
        if (isProcessingScan) return;

        const trimmed = decodedText.trim();
        const isPureNumeric = /^\d+$/.test(trimmed);
        const isTooShort = trimmed.length < 6;
        if (isPureNumeric || isTooShort) return;

        isProcessingScan = true;

        scannerInstance.stop().then(() => {
            transitionToRecordingState(trimmed);
        }).catch(() => {
            transitionToRecordingState(trimmed);
        });
    }

    function handleScannerError(err) {
        console.error("Camera scanner startup failed:", err);
        alert("Unable to access camera for scanning. Please ensure you have granted camera permissions.");
        resetToLandingState();
    }

    function transitionToRecordingState(decodedText) {
        elReaderContainer.style.display = "none";
        elRcrdStation.style.display = "block";
        elOrderLabel.textContent = decodedText;
        startRecordingSession(decodedText);
    }

    elScannerBtn.addEventListener("click", startScanner);

    async function startRecordingSession(orderId) {
        activeOrderId = orderId;
        recordedChunks = [];

        cleanMediaStreams();

        const idealConstraints = {
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true
        };

        try {
            mediaStream = await navigator.mediaDevices.getUserMedia(idealConstraints);
        } catch (err) {
            console.warn("Audio unavailable, falling back to video-only:", err);

            const fallbackConstraints = {
                video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false
            };

            try {
                mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
            } catch (fallbackErr) {
                console.error("Camera access failed entirely:", fallbackErr);
                alert("Hardware Access Denied: Camera access is required to generate proof videos.");
                resetToLandingState();
                return;
            }
        }

        elPreview.srcObject = mediaStream;
        elPreview.play().catch(() => {});
        elPreviewWrapper.classList.add("active-recording");

        let mimeType = "";
        const candidates = [
            "video/mp4;codecs=avc1",
            "video/mp4",
            "video/webm;codecs=vp9,opus",
            "video/webm;codecs=vp8,opus",
            "video/webm"
        ];
        for (const candidate of candidates) {
            if (MediaRecorder.isTypeSupported(candidate)) {
                mimeType = candidate;
                break;
            }
        }

        try {
            mediaRecorder = mimeType
                ? new MediaRecorder(mediaStream, { mimeType })
                : new MediaRecorder(mediaStream);
        } catch (e) {
            console.warn("MediaRecorder codec fallback:", e);
            mediaRecorder = new MediaRecorder(mediaStream);
        }

        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = saveRecordedProof;

        mediaRecorder.start(1000);
        startRecordingTimer();
    }

    elDoneBtn.addEventListener("click", () => {
        if (!mediaRecorder || mediaRecorder.state === "inactive") return;
        stopRecordingSession();
    });

    function stopRecordingSession() {
        stopRecordingTimer();
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
    }

    function saveRecordedProof() {
        if (recordedChunks.length === 0) {
            console.error("No video data recorded.");
            cleanMediaStreams();
            elRecTimer.textContent = "00:00";
            elOrderLabel.textContent = "";
            resetToLandingState();
            return;
        }

        const actualMime = (mediaRecorder && mediaRecorder.mimeType) || "video/webm";
        const isMP4 = actualMime.includes("mp4");
        const fileExt = isMP4 ? "mp4" : "webm";

        const blob = new Blob(recordedChunks, { type: actualMime });
        const url = URL.createObjectURL(blob);

        const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, "");
        const safeOrderId = activeOrderId.replace(/[^a-z0-9]/gi, "_");
        const fileName = `proof_order_${safeOrderId}_${timestamp}.${fileExt}`;

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = fileName;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();

        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        }, 1500);

        showToastNotification(`Proof saved for Order #${activeOrderId}`);

        cleanMediaStreams();
        startScanner();
    }

    function startRecordingTimer() {
        let elapsedSeconds = 0;
        elRecTimer.textContent = "00:00";
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            elapsedSeconds++;
            const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
            const secs = (elapsedSeconds % 60).toString().padStart(2, "0");
            elRecTimer.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function stopRecordingTimer() {
        clearInterval(timerInterval);
    }

    function cleanMediaStreams() {
        elPreviewWrapper.classList.remove("active-recording");

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }

        elPreview.srcObject = null;
    }

    function resetToLandingState() {
        elRcrdStation.style.display = "none";
        elReaderContainer.style.display = "none";
        elLanding.style.display = "block";
    }

    function showToastNotification(message) {
        const toast = document.getElementById("success-toast");
        const toastDesc = document.getElementById("toast-desc");

        toastDesc.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 4500);
    }
});
