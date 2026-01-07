# Basketball Kids App

A mobile basketball app for kids to bet on NBA games using points and redeem merchandise.

## Features

- **Live NBA Games**: Watch live NBA games directly in the app
- **Betting System**: Bet on game outcomes and player statistics using points
- **Points System**: Earn and spend points on merchandise and raffle entries
- **Merchandise Store**: Cash in points for NBA merchandise
- **Raffle System**: Enter raffles to win NBA game tickets
- **Betting History**: Track your betting history and outcomes
- **Player Stats**: View detailed player statistics and bet on them

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## App Structure

- **LiveGamesScreen**: Main screen showing live NBA games with streaming and betting options
- **GameDetailScreen**: Detailed game view with live streaming and betting interface
- **PlayerStatsScreen**: Player statistics and betting on individual player performance
- **RaffleScreen**: NBA ticket raffle system
- **MerchScreen**: Merchandise store for redeeming points
- **MyBetsScreen**: Betting history and outcomes tracking

## Key Features

### Betting System
- Bet on game outcomes (team wins)
- Bet on player statistics (points, rebounds, assists, etc.)
- Bet on total points scored
- Real-time odds and potential winnings

### Points System
- Start with 1,250 points
- Earn points through successful bets
- Spend points on merchandise and raffle entries
- Track point balance across all screens

### Live Streaming
- Watch live NBA games
- Real-time game scores and statistics
- Interactive betting during live games

### Merchandise Store
- NBA jerseys, basketballs, caps, sneakers
- Point-based pricing system
- Shopping cart functionality
- Checkout process

### Raffle System
- Enter raffles for NBA game tickets
- Multiple entries allowed (up to 5)
- 500 points per entry
- Prize: 2 NBA game tickets

## Navigation

The app uses a bottom tab navigation with four main sections:
- **Games**: Live games and streaming
- **Raffle**: NBA ticket raffles
- **Merch**: Merchandise store
- **My Bets**: Betting history and outcomes

## Technologies Used

- React Native
- Expo
- React Navigation
- Expo AV (for video streaming)
- Vector Icons

## Development Notes

- All betting is done with points (no real money)
- NBA games are simulated for demonstration
- Video streaming uses sample videos
- Points system is persistent during app session
- Dark theme optimized for mobile viewing

## Future Enhancements

- Real NBA API integration
- Live video streaming
- Social features and leaderboards
- More merchandise options
- Push notifications for game updates
- Advanced betting options

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/pmchrislee/BasketballKidsApp?utm_source=oss&utm_medium=github&utm_campaign=pmchrislee%2FBasketballKidsApp&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
