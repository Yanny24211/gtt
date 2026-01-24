# GO Train Tracker ETA (GTT ETA)

GO Train Tracker ETA is a real-time web application that displays estimated arrival times, trip details, and stop information for GO Transit trains across the Greater Toronto and Hamilton Area (GTHA). The application consumes live transit data and presents it in a clean, readable interface to help riders better plan their trips.

🚆 Live site: https://gtt-eta.vercel.app

---

## Features

- Real-time estimated arrival times for GO Train trips
- Live trip and stop data fetched from GO Transit (Metrolinx)
- Automatic polling to keep data fresh
- Type-safe data handling with TypeScript
- Fast and responsive UI built with Next.js
- Deployed and hosted on Vercel

---

## Tech Stack

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Vercel**
- **Leaflet.js** (for mapping, if enabled)
- **GO Transit / Metrolinx API**

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

---

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gtt-eta.git
   cd gtt-eta
   npm i
   npm run dev
