import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const initialState = {
  userPoints: 1000, // Starting points for testing
  userBets: [],
  raffleEntries: 0,
  cart: [],
  shippingInfo: {
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  },
  completedBets: [],
  isLoading: true, // Loading state for initial data fetch
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_POINTS':
      return { ...state, userPoints: action.payload };
    case 'ADD_USER_POINTS':
      return { ...state, userPoints: state.userPoints + action.payload };
    case 'SUBTRACT_USER_POINTS':
      return { ...state, userPoints: state.userPoints - action.payload };
    case 'ADD_BET':
      return { ...state, userBets: [...state.userBets, action.payload] };
    case 'REMOVE_BET':
      return { ...state, userBets: state.userBets.filter(bet => bet.id !== action.payload) };
    case 'COMPLETE_BET':
      const bet = state.userBets.find(b => b.id === action.payload.betId);
      const updatedBets = state.userBets.filter(b => b.id !== action.payload.betId);
      const completedBet = { ...bet, ...action.payload.result, status: action.payload.result.status };
      return {
        ...state,
        userBets: updatedBets,
        completedBets: [...state.completedBets, completedBet],
        userPoints: action.payload.result.status === 'won' 
          ? state.userPoints + action.payload.result.winnings 
          : state.userPoints
      };
    case 'ADD_RAFFLE_ENTRY':
      return { ...state, raffleEntries: state.raffleEntries + 1 };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'UPDATE_SHIPPING_INFO':
      return { ...state, shippingInfo: action.payload };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const saveTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  // Load state from AsyncStorage on app start
  useEffect(() => {
    loadState();
  }, []);

  // Save state to AsyncStorage whenever state changes (with debouncing)
  useEffect(() => {
    // Skip saving on initial mount (before data is loaded)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout to save after 500ms of no changes
    saveTimeoutRef.current = setTimeout(() => {
      saveState();
    }, 500);

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state]);

  const loadState = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('🔄 Loading state from storage...');
      const savedState = await AsyncStorage.getItem('appState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        console.log('✅ Loaded saved state:', parsedState);
        // Only load if we have valid data
        if (parsedState.userPoints !== undefined) {
          dispatch({ type: 'SET_STATE', payload: { ...parsedState, isLoading: false } });
        } else {
          console.log('⚠️ Invalid saved state, using defaults');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        console.log('ℹ️ No saved state found, using defaults');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('❌ Error loading state:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveState = async () => {
    try {
      // Exclude isLoading from saved state
      const { isLoading, ...stateToSave } = state;
      await AsyncStorage.setItem('appState', JSON.stringify(stateToSave));
      console.log('State saved successfully:', stateToSave);
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const addPoints = (points) => {
    dispatch({ type: 'ADD_USER_POINTS', payload: points });
  };

  const subtractPoints = (points) => {
    dispatch({ type: 'SUBTRACT_USER_POINTS', payload: points });
  };

  const placeBet = async (bet) => {
    const newBet = {
      ...bet,
      id: Date.now(),
      status: 'active',
      timePlaced: new Date().toISOString(),
    };
    console.log('📝 Placing bet:', newBet);
    console.log('📊 Current state before bet:', { userPoints: state.userPoints, activeBets: state.userBets.length });
    dispatch({ type: 'ADD_BET', payload: newBet });
    dispatch({ type: 'SUBTRACT_USER_POINTS', payload: bet.amount });
    console.log('✅ Bet placed successfully');

    // Force immediate save for critical action
    setTimeout(() => saveState(), 100);
  };

  const completeBet = (betId, result) => {
    dispatch({ type: 'COMPLETE_BET', payload: { betId, result } });
  };

  const simulateBetCompletion = (betId, won) => {
    const bet = state.userBets.find(b => b.id === betId);
    if (bet) {
      const result = {
        status: won ? 'won' : 'lost',
        winnings: won ? bet.potentialWin - bet.amount : 0,
        result: won ? `Won +${bet.potentialWin - bet.amount} points` : `Lost -${bet.amount} points`
      };
      completeBet(betId, result);
    }
  };

  const addRaffleEntry = async () => {
    console.log('🎫 Adding raffle entry');
    console.log('📊 Current raffle entries:', state.raffleEntries);
    dispatch({ type: 'ADD_RAFFLE_ENTRY' });
    console.log('✅ Raffle entry added');

    // Force immediate save for critical action
    setTimeout(() => saveState(), 100);
  };

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const updateShippingInfo = (shippingInfo) => {
    dispatch({ type: 'UPDATE_SHIPPING_INFO', payload: shippingInfo });
  };

  const value = {
    ...state,
    addPoints,
    subtractPoints,
    placeBet,
    completeBet,
    simulateBetCompletion,
    addRaffleEntry,
    addToCart,
    removeFromCart,
    clearCart,
    updateShippingInfo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
