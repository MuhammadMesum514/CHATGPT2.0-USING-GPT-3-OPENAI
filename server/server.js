const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAIApi, Configuration } = require("openai");
dotenv.config();

const config = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(config);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');    
});

app.post('/', async (req, res) => {
try {
    const prompt = req.body.prompt;
    // res.send({bot:prompt});
   response = await openai.createCompletion({
     model : "text-davinci-003",
     prompt : `${prompt}`,
     temperature : 0.4,
     max_tokens : 3000,
     top_p : 1,
     frequency_penalty : 0.4,
     presence_penalty : 0,
     stop : ['"""']
});
   res.status(200).send({bot:response.data.choices[0].text});
} catch (error) {
    console.log(error);
     res.status(500).send({error: error});   
}
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
}
);