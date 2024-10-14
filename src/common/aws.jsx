import axios from "axios";

export const uploadImage = async (img) => {

    let imgUrl = null;

    // console.log(process.env.REACT_APP_URL)

    await axios.get(process.env.REACT_APP_URL + "/blog/get-upload-url")
        .then(async ({ data: { uploadURL } }) => {

            await axios({
                method: "PUT",
                url: uploadURL,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: img
            })
                .then(() => {
                    imgUrl = uploadURL.split("?")[0]
                })
        })

    return imgUrl
}
