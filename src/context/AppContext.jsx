import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { dummyCompanies, dummyCommunicationMethods, dummyCommunications } from '../data/dummyData';

const AppContext = createContext();

const initialState = {
  companies: dummyCompanies,
  communicationMethods: dummyCommunicationMethods,
  communications: dummyCommunications,
};

const actionTypes = {
  ADD_COMPANY: 'ADD_COMPANY',
  UPDATE_COMPANY: 'UPDATE_COMPANY',
  DELETE_COMPANY: 'DELETE_COMPANY',
  ADD_COMMUNICATION_METHOD: 'ADD_COMMUNICATION_METHOD',
  UPDATE_COMMUNICATION_METHOD: 'UPDATE_COMMUNICATION_METHOD',
  DELETE_COMMUNICATION_METHOD: 'DELETE_COMMUNICATION_METHOD',
  ADD_COMMUNICATION: 'ADD_COMMUNICATION',
  UPDATE_COMMUNICATION: 'UPDATE_COMMUNICATION',
  DELETE_COMMUNICATION: 'DELETE_COMMUNICATION',
  LOAD_STATE: 'LOAD_STATE'
};

function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_COMPANY:
      return {
        ...state,
        companies: [...state.companies, action.payload]
      };
    case actionTypes.UPDATE_COMPANY:
      return {
        ...state,
        companies: state.companies.map(company =>
          company.id === action.payload.id ? action.payload : company
        )
      };
    case actionTypes.DELETE_COMPANY:
      return {
        ...state,
        companies: state.companies.filter(company => company.id !== action.payload),
        communications: state.communications.filter(comm => comm.companyId !== action.payload)
      };
    case actionTypes.ADD_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: [...state.communicationMethods, action.payload]
      };
    case actionTypes.UPDATE_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: state.communicationMethods.map(method =>
          method.id === action.payload.id ? action.payload : method
        )
      };
    case actionTypes.DELETE_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: state.communicationMethods.filter(method => method.id !== action.payload)
      };
    case actionTypes.ADD_COMMUNICATION:
      return {
        ...state,
        communications: [...state.communications, action.payload]
      };
    case actionTypes.UPDATE_COMMUNICATION:
      return {
        ...state,
        communications: state.communications.map(comm =>
          comm.id === action.payload.id ? action.payload : comm
        )
      };
    case actionTypes.DELETE_COMMUNICATION:
      return {
        ...state,
        communications: state.communications.filter(comm => comm.id !== action.payload)
      };
    case actionTypes.LOAD_STATE:
      return action.payload;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      dispatch({ type: actionTypes.LOAD_STATE, payload: JSON.parse(savedState) });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  // Calculate overdue and upcoming communications
  const getCompanyStatus = (companyId) => {
    const company = state.companies.find(c => c.id === companyId);
    if (!company) return null;

    const communications = state.communications
      .filter(c => c.companyId === companyId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const lastCommunication = communications[0];
    if (!lastCommunication) return { isOverdue: true, isDueToday: false };

    const today = new Date();
    const lastDate = new Date(lastCommunication.date);
    const dueDate = new Date(lastDate);
    dueDate.setDate(dueDate.getDate() + company.communicationPeriodicity);

    return {
      isOverdue: today > dueDate,
      isDueToday: today.toDateString() === dueDate.toDateString()
    };
  };

  const value = {
    state,
    dispatch,
    actions: {
      addCompany: (company) => dispatch({ type: actionTypes.ADD_COMPANY, payload: company }),
      updateCompany: (company) => dispatch({ type: actionTypes.UPDATE_COMPANY, payload: company }),
      deleteCompany: (id) => dispatch({ type: actionTypes.DELETE_COMPANY, payload: id }),
      addCommunicationMethod: (method) => dispatch({ type: actionTypes.ADD_COMMUNICATION_METHOD, payload: method }),
      updateCommunicationMethod: (method) => dispatch({ type: actionTypes.UPDATE_COMMUNICATION_METHOD, payload: method }),
      deleteCommunicationMethod: (id) => dispatch({ type: actionTypes.DELETE_COMMUNICATION_METHOD, payload: id }),
      addCommunication: (communication) => dispatch({ type: actionTypes.ADD_COMMUNICATION, payload: communication }),
      updateCommunication: (communication) => dispatch({ type: actionTypes.UPDATE_COMMUNICATION, payload: communication }),
      deleteCommunication: (id) => dispatch({ type: actionTypes.DELETE_COMMUNICATION, payload: id })
    },
    utils: {
      getCompanyStatus,
      getCompanyCommunications: (companyId) => 
        state.communications
          .filter(c => c.companyId === companyId)
          .sort((a, b) => new Date(b.date) - new Date(a.date)),
      getOverdueCommunications: () => 
        state.companies.filter(company => getCompanyStatus(company.id).isOverdue),
      getTodaysCommunications: () => 
        state.companies.filter(company => getCompanyStatus(company.id).isDueToday)
    }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
