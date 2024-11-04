Energy Trading DApp
Welcome to the Energy Trading DApp, a decentralized platform that enables users to trade renewable energy directly without intermediaries. This project empowers individuals and businesses to buy and sell energy in a secure, transparent, and user-friendly way.

Table of Contents
Overview
Features
Tech Stack
Getting Started
Smart Contract Details
Frontend and Backend Structure
User Roles
Providers
Buyers
Usage
Project Structure
Future Enhancements
Contact
Overview
The Energy Trading DApp provides a decentralized marketplace where:

Providers can list their energy offers, set prices, and track sales.
Buyers can browse available energy offers and purchase energy directly if they have sufficient funds.
Features
MetaMask Integration: Users can register and log in with MetaMask.
User Roles: Support for Providers (sellers) and Buyers.
Secure Transactions: Smart contract handles secure energy purchases and payments.
Listing & Monitoring: Providers can manage and track energy offers and sales.
Real-time Availability: Buyers see the most current listings from providers.
Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js, MongoDB for data persistence
Blockchain: Ethereum (using Remix for the smart contract)
Web3: Web3.js for blockchain interactions
Getting Started
To set up the project locally, follow these steps:

Prerequisites
MetaMask: Install MetaMask and create an Ethereum wallet.
Node.js & npm: Install Node.js and npm (Node Package Manager).
MongoDB: Install MongoDB and use MongoDB Compass for local database management.
Installation
Clone the repository:

bash
Копировать код
git clone <repository-url>
cd energy-trading-dapp
Install dependencies:

bash
Копировать код
npm install
Run the application:

bash
Копировать код
npm start
Open your browser and navigate to http://localhost:3000.

Smart Contract Details
The smart contract is written in Solidity and deployed on Ethereum (Remix VM). It facilitates:

Registration of providers and buyers
Listing and purchasing of energy offers
Tracking of energy sales
Contract Methods:

registerProvider: Registers a new energy provider.
createOffer: Allows providers to create a new energy listing.
purchaseEnergy: Enables buyers to purchase available energy.
getProviderSales: Retrieves sales data for providers.
Frontend and Backend Structure
The frontend allows users to interact with the smart contract, while the backend (Express.js) integrates MongoDB to manage user data, energy listings, and purchase history.

Frontend:

Registration/Login
Dashboard for browsing and purchasing energy
Listings management for providers
Backend:

Authentication and data persistence
API for fetching and updating user information
User Roles
Providers
Providers can:

Register via MetaMask and list their energy offerings.
Set energy price, quantity, and description.
Track the amount of energy sold and monitor sales.
Buyers
Buyers can:

Browse available energy offers.
Purchase energy directly if they have sufficient funds.
View their purchase history.
Usage
Register/Login with MetaMask: Click "Login with MetaMask" and confirm wallet access.
Provider Actions:
Navigate to "List Energy" to add new energy offers.
View and manage active offers in "My Products."
Buyer Actions:
Browse available energy under "Purchase Energy."
Click "Buy" to purchase energy, transferring funds to the provider.
Project Structure
graphql
Копировать код
energy-trading-dapp/
├── contracts/           # Smart contract files
├── src/
│   ├── frontend/        # HTML, CSS, JavaScript for UI
│   ├── backend/         # Express.js API and MongoDB integration
│   └── config/          # Database and server configuration
├── README.md
└── package.json
Future Enhancements
Rating System: Enable users to rate energy providers.
Enhanced Search: Add filtering options for buyers to find specific energy types.
Analytics Dashboard: Provide providers with real-time sales analytics.
Contact
If you have any questions or need assistance, please contact:

Project Lead: [Your Name]
Email: [Your Email]
LinkedIn: [Your LinkedIn Profile]
