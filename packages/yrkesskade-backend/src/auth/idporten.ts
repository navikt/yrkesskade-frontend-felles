import axios from 'axios';

// Mock IDPorten
export const getMockTokenFromIdPorten = async () => {
    return await (
        await axios.get(`${process.env.FAKEDINGS_URL_IDPORTEN}?acr=Level=4`)
    ).data;
};
