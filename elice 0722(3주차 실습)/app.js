const express = require("express")
const app = express();
const dayjs = require('dayjs');
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myapp');

mongoose.connection.on("error", (err) => {
    console.log(err);
});

mongoose.connection.on('connected', () => {
    console.log("Database Connection Success");
});

app.use(cors()); //cors 오류를 일시적으로 해결, 'npm install http cors' 입력

app.use(express.json()); // 이걸 해줘야지 json형태로 바디로 받아오기 때문에 필수!

app.use(bodyParser.urlencoded({extended: false})); //이걸 통해 html의 form을 통해 들어오는 데이터를 처리한다.

app.use("/posts", postsRouter);

app.use("/user", userRouter);

app.locals.formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

app.listen(8080, () => {
    console.log("server open");
})