import { clarity } from 'react-microsoft-clarity';

export const initClarity = () => {
    // Replace 'YOUR_CLARITY_PROJECT_ID' with your actual Clarity project ID.
    // Ideally, this should come from an environment variable.
    const clarityId = process.env.REACT_APP_CLARITY_ID;

    if (clarityId) {
        clarity.init(clarityId);
    } else {
        console.warn('Clarity Project ID not found in environment variables.');
    }
};
