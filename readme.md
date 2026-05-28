# PackSafely 📦

**Scan. Pack. Prove.**  
A lightweight, browser-based packing proof tool built for small D2C sellers and ecommerce businesses who are tired of losing disputes they should win.

---

## The Problem
You packed the order. You know you packed it right. But the customer says the box arrived empty. Or damaged. Or with the wrong item.  
And you have **zero proof**.

So you lose the dispute. You refund the money. And you move on — a little more frustrated, a little more out of pocket.  
This happens every day to thousands of sellers on Amazon, Flipkart, Meesho, and their own stores. Not because they did anything wrong. But because they had no way to prove they did it right.

## What PackSafely Does
PackSafely turns your camera into a packing proof station — in your browser, on any device, with no installation needed.

**Here's the entire flow:**
1. Open the web app — no download, no signup, just open the link.
2. Scan the barcode on the shipping label — order ID is captured automatically.
3. Recording starts immediately — your packing process is recorded with the order ID stamped on screen.
4. Tap "Packing Done" — the video saves to your device with the order ID as the filename.

Next time a customer files a dispute — you search the order ID, pull up the video, and share it. **Dispute closed in seconds.**

## Who This Is Built For
- Small D2C sellers packing 10 to 200 orders a day
- Anyone selling on Amazon, Flipkart, Meesho, or their own website
- Sellers who pack orders themselves or with a small team
- Anyone who has ever lost a dispute they knew they should have won

*If you've ever thought "I wish I had proof of this" while packing an order — this is for you.*

## Why It's Different
Most packaging verification tools out there are built for large warehouses. They require dedicated hardware, IT setup, enterprise pricing, and a team to manage them.

**PackSafely is different:**
- **Works in any browser** — Chrome on your phone or laptop, no app needed
- **No hardware required** — just your existing camera
- **No IT setup** — open the link and start scanning
- **No storage cost** — videos save directly to your device
- **Built for speed** — the entire flow takes under 30 seconds per order

## How It Works — Under The Hood
PackSafely is built with plain HTML, CSS, and JavaScript. No frameworks, no backend, no server costs.

- **Barcode scanning** — powered by `html5-qrcode`, reads CODE-128, CODE-39, and QR codes used by all major Indian marketplaces
- **Video recording** — powered by the browser's native `MediaRecorder` API, no plugins needed
- **Storage** — videos download directly to the user's device, tagged with the order ID and timestamp
- **Deployment** — hosted on Vercel, accessible from any device with a browser

## Getting Started
No installation needed. Just open the link:  
🚀 **[packsafely.vercel.app](https://packsafely.vercel.app)**

### Current Features (Prototype)
- [x] Barcode and QR code scanning
- [x] Automatic recording triggered by scan
- [x] Order ID overlay on video
- [x] Video saves with order ID as filename
- [x] Instant reset after each order — ready for the next pack

### Coming Soon
- [ ] Google Drive integration — videos auto-save to seller's own Drive
- [ ] Searchable video library by order ID
- [ ] Multi-platform support — Amazon, Flipkart, Meesho order sync
- [ ] Team accounts — multiple packers, one dashboard
- [ ] Hindi language support

## The Story Behind This
This started as a simple observation — small sellers in India are losing money every day on disputes they can't prove. The tools that exist are built for enterprises, not for someone packing orders in a small room with a phone and a dream.

PackSafely is being built in public, by a solo founder, learning while building. Every feature is driven by real conversations with real sellers.

If you're a seller and want to try it, give feedback, or just talk about the problem — reach out. This is being built for you.

## Contributing
This is an open-source project. If you find a bug, have a feature idea, or want to contribute — open an issue or send a PR. All contributions are welcome.

## License
**MIT** — free to use, modify, and distribute.

---
*Built with a lot of frustration on behalf of every seller who ever lost a dispute they should have won.*

## Contact
- **Email:** [anirankari19@gmail.com](mailto:anirankari19@gmail.com)
- **LinkedIn:** [Ashish Nirankari](https://www.linkedin.com/in/ashish-nirankari/)
