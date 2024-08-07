import { v } from "convex/values";
import { action } from "./_generated/server";
import axios from 'axios';
import OpenAI from 'openai'

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
})

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },

  handler: async (_, { voice, input }) => {
    const options = {
      method: 'POST',
      url: 'https://api.v7.unrealspeech.com/speech',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer L0NOC85vvEtA1f8eNrrqFHDs7aKNBsTVlFWW6rbyT9WYMNwfthk79t'
      },
      data: {
        Text: input,
        VoiceId: voice,
        Bitrate: '192k',
        Speed: '0',
        Pitch: '1',
        TimestampType: 'word'
      }
    };
    
    try {
      const response = await axios.request(options);
      return response.data.OutputUri; // Return the OutputUri
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate audio');
    }
// const response =  await axios
//       .request(options)
//       return response.data.OutputUr
//       .then(function (response) {
//         console.log(response.data);
//       })
//       .catch(function (error) {
//         console.error(error);
//       });

      
},

});


// export const generateThumbnailAction = action({
//   args: {prompt: v.string()},
//   handler: async (_, { prompt }) => {

//     const options = {
//       method: 'POST',
//       headers: {'x-freepik-api-key': 'FPSXdb1266edfd024970a5f6b808232e85cc', 'Content-Type': 'application/json'},
//       body: '{"prompt":"Crazy dog in the space","negative_prompt":"b&w, earth, cartoon, ugly","num_inference_steps":8,"guidance_scale":2,"seed":42,"num_images":1,"image":{"size":"square"},"styling":{"style":"anime","color":"pastel","lightning":"warm","framing":"portrait"}}',
//     };
    
//    const response = await  fetch('https://api.freepik.com/v1/ai/text-to-image', options)
//       .then(response => response.json())
//       .then(response => console.log(response))
//       .catch(err => console.error(err));

// //  const response =  await openai.images.generate({
// //       model: 'dall-e-3',
// //       prompt,
// //       size: '1024x1024',
// //       quality: 'standard',
// //       n: 1,
// //     })

//     const url = response.data[0].url


//     if(!url) {
//       throw new Error('Error generating thumbnail')
//     }

//     const imageResponse = await fetch(url)
//     const buffer = await imageResponse.arrayBuffer()
//     return buffer
//   }
// })


export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const apiKey = 'FPSXdb1266edfd024970a5f6b808232e85cc'; // Use your actual API key

    const options = {
      method: 'POST',
      headers: {
        'x-freepik-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        // negative_prompt: "b&w, earth, cartoon, ugly",
        num_inference_steps: 8,
        guidance_scale: 2,
        seed: 42,
        num_images: 1,
        image: { size: "square" },
        // styling: {
        //   style: "anime",
        //   color: "pastel",
        //   lightning: "warm",
        //   framing: "portrait"
        // }
      }),
    };

    try {
      const response = await fetch('https://api.freepik.com/v1/ai/text-to-image', options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to generate thumbnail: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      const base64ImageData = result.data[0].base64; // Access the base64 image data

      if (!base64ImageData) {
        throw new Error('Error generating thumbnail: No base64 image data returned');
      }

      // Convert base64 string to binary data
      const binaryString = atob(base64ImageData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create a Blob from the Uint8Array
      const blob = new Blob([bytes], { type: 'image/png' }); // Adjust MIME type if necessary

      // Use arrayBuffer() to get the ArrayBuffer from the Blob
      const imageResponse = await new Response(blob).arrayBuffer();
      
      return imageResponse; // Return the ArrayBuffer
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      throw error; // Rethrow the error for handling upstream
    }
  }
});