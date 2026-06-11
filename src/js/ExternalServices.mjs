async function convertToJson(res) {
    const jsonResponse = await res.json();
    if (res.ok) {
        return jsonResponse;
    } else {
        throw { name: "apiError", message: jsonResponse };
    }
}

export default class ExternalServices {
    constructor() {
        this.giphyApiKey = "SUA_CHAVE_AQUI";
    }

    // API Endpoint 1: RandomUser
    async getRandomNPC() {
        const url = "https://randomuser.me/api/?inc=name,picture,location,gender,email";
        const res = await fetch(url);
        const data = await convertToJson(res);
        return data.results[0];
    }

    // API Endpoint 2: Giphy API -
    async getEmotionFeedbackGIF(emotionKeyword) {
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${this.giphyApiKey}&q=${emotionKeyword}&limit=1&rating=g`;
        const res = await fetch(url);
        const data = await convertToJson(res);
        return data.data[0];
    }
}