async function convertToJson(res) {

    const jsonResponse = await res.json();

    if (res.ok) {
        return jsonResponse;
    }

    throw {
        name: "apiError",
        status: res.status,
        message: jsonResponse
    };
}

export default class ExternalServices {

    constructor() {

        this.giphyApiKey =
            "DEDDGS1S5z1FpT9DqVs3DywD15epdh00";
    }

    // =====================================================
    // API 1 - RandomUser
    // =====================================================

    async getRandomNPC() {

        try {

            const url =
                "https://randomuser.me/api/?inc=name,picture,location,gender,email";

            const res =
                await fetch(url);

            const data =
                await convertToJson(res);

            return data.results[0];

        } catch (error) {

            console.error(
                "RandomUser API Error:",
                error
            );

            return null;
        }
    }

    // =====================================================
    // API 2 - Giphy
    // =====================================================

    async getEmotionFeedbackGIF(
        emotionKeyword
    ) {

        try {

            const url =
                `https://api.giphy.com/v1/gifs/search?api_key=${this.giphyApiKey}&q=${encodeURIComponent(emotionKeyword)}&limit=1&rating=g`;

            const res =
                await fetch(url);

            const data =
                await convertToJson(res);

            return data.data[0];

        } catch (error) {

            console.error(
                "Giphy API Error:",
                error
            );

            return null;
        }
    }

    // =====================================================
    // API 3 - Advice Slip
    // =====================================================

    async getReflectionAdvice() {

        try {

            const url =
                "https://api.adviceslip.com/advice";

            const res =
                await fetch(url);

            const data =
                await convertToJson(res);

            return data.slip;

        } catch (error) {

            console.error(
                "Advice API Error:",
                error
            );

            return null;
        }
    }
}