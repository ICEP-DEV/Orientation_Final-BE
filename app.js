//PORT FOR THE API ENDPOINT________________________
const { APP_PORT, DATABASE, HOSTNAME } = require('./globals');
//_________________________________________________

const express = require('express');
const path = require('path');
const app = express()
const multer = require('multer');
const mariadb = require('./connection');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
    //Header allowences of METHODS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
 
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app
)

//Publisize a folder
app.use(express.static('public'));
app.use('/images', express.static('bin/images'));
app.use('/videos', express.static('bin/videos'));


// define endpoints
//----------------------------------------------------------------------------------Stock Libraries
//Student
//--Test
const TestQuery_cnxt = require("./contexts/Common/TestQuery")
const Student_cnxt = require("./contexts/Common/Students")
//--Auth 
const Registration_cnxt = require('./contexts/Authentication/Registration')
const Login_cnxt = require("./contexts/Authentication/Login")
const Forgotten_cnxt = require("./contexts/Authentication/Forgotten")
//--Profile
const Profile_Update_cnxt = require("./contexts/Profile/Update")

//Blog
const Blog_cnxt = require('./contexts/Blog/blog')

//Admin
const RegistrationAdm_cnxt = require('./contexts/Authentication/Register_Adm')
const LoginAdm_cnxt = require("./contexts/Authentication/Login_Adm")

const LoginTrackAdm_cnxt = require('./contexts/Tracking/LoginsOverview')
const UpdateVideo_cnxt = require('./contexts/Administrator/UpdateVideo')
const SearchAll_cnxt = require('./contexts/Administrator/GlobalSearch')
// //common

//--Stats
const Stats_cnxt = require('./contexts/Statistics/Stats')
//--Track
const Track_Add_cnxt = require('./contexts/Tracking/TrackAdd')
const Track_Get_cnxt = require('./contexts/Tracking/TrackGet')
const Track_Prog_cnxt = require('./contexts/Tracking/Progress')
const Track_Survey_cnxt = require('./contexts/Tracking/Survey')
const Track_Orientation_cnxt = require('./contexts/Tracking/Orientation')
//Orientation
const AllCampus_cnxt = require("./contexts/Orientation/AllCampus")
const Faculty_cnxt = require("./contexts/Orientation/Faculty")
const Videos_cnxt = require("./contexts/Orientation/Video")
const SurvQuestion_cnxt = require("./contexts/Orientation/Questions")
//Send Email NodeMailer
const SendEmail_cnxt = require('./contexts/nodemailer')



//context channelling Student
app.use('/Test/TestQuery', TestQuery_cnxt);
app.use('/Auth/Registration', Registration_cnxt);
app.use('/Stud/Student', Student_cnxt);
app.use('/Auth/Login', Login_cnxt);
app.use('/Auth/Forgotten', Forgotten_cnxt);
app.use('/Profile/Update', Profile_Update_cnxt);
app.use('/Orientation/Faculty', Faculty_cnxt)
app.use('/Orientation/Videos', Videos_cnxt)

//context channelling Admin
app.use('/Auth/Registration_Admin', RegistrationAdm_cnxt);
app.use('/Auth/Login_Admin', LoginAdm_cnxt);
app.use('/Track/LoginOverview', LoginTrackAdm_cnxt)
app.use('/Admin/UpdateDeleteVideo', UpdateVideo_cnxt)
app.use('/Search', SearchAll_cnxt)

//context to common entities
app.use('/Stat/Stats', Stats_cnxt);
app.use('/Track/New', Track_Add_cnxt)
app.use('/Track/Query', Track_Get_cnxt)
app.use('/Track/Progress', Track_Prog_cnxt)
app.use('/Track/Survey', Track_Survey_cnxt)
app.use('/Track/Orientation', Track_Orientation_cnxt)
app.use('/Orientation/Campus', AllCampus_cnxt)
app.use('/Orientation/Question', SurvQuestion_cnxt)
app.use('/NodeMailer', SendEmail_cnxt)

//context to blog entities
app.use('/Blog/blog', Blog_cnxt);



const handleErr = (error, req, res, next) => {
    res.status(400).send(error.message)
    return
}

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'bin/images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

const videoStorage = multer.diskStorage({
    destination: 'bin/videos', // Destination to store video 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 10000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|PNG|JPG|JPEG|GIF|gif|jpeg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 150000000 // 50000000 Bytes = 50 MB
    },
    fileFilter(req, file, cb) {
        // upload only mp4 and mkv format
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
            return cb(new Error('Please upload a video'))
        }
        cb(undefined, true)
    }
})

//Delete Video
app.delete('/deleteVideo', (req, res, next) => {

    if (Object.keys(req.query).length == 0) {
        res.send({
            error: true,
            code: "DV001",
            message: "No element was found on the query elements"
        })
        return
    }

    if (!req.query.id) {
        res.send({
            error: true,
            code: "DV002",
            message: "No id element was found on the query"
        })
        return
    }


    mariadb.query(`SELECT path FROM videos WHERE id = ${req.query.id}`, (outer_err, outer_rows, outer_fields) => {
        if (outer_rows.length)
            mariadb.query(`DELETE FROM videos WHERE id = ${req.query.id}`, (err, rows, fields) => {

                fs.unlink("bin" + outer_rows[0].path.replace(HOSTNAME, ""), (inner_err) => {

                    if (err == null) {
                        if (outer_err == null) {
                            if (inner_err == null) {
                                res.send({
                                    error: false,
                                    data: rows,
                                })
                                return
                            }
                            else {
                                res.send({
                                    error: true,
                                    code: "DV001_SQL-inner_err",
                                    message: "Couldn't complete the whole delete cycle",
                                    sqlMessage: err,
                                    sqlMessageOuter: inner_err,
                                })
                                return
                            }
                        }
                        else {
                            res.send({
                                error: true,
                                code: "DV001_SQL-outter_err",
                                message: "Couldn't complete the whole delete cycle",
                                sqlMessageOuter: outer_err,
                            })
                            return
                        }
                    } else {
                        res.send({
                            error: true,
                            code: "DV001_SQL-err",
                            message: "Couldn't complete the whole delete cycle",
                            sqlMessage: err,
                        })
                        return
                    }
                })

            });
        else
            res.send({
                error: true,
                code: "DV003",
                message: "Video wasn't found from the database",

            })
        return

    })
});

app.delete('/deleteBlog', (req, res, next) => {

    let field;

    if (Object.keys(req.query).length == 0) {
        res.send({
            error: true,
            code: "S001",
            message: "query parameters were not found"
        })
        return
    }

    if (req.query.id) {
        mariadb.query(`SELECT path FROM blog WHERE id = ${req.query.id}`, (outer_err, outer_rows, outer_fields) => {
            if (outer_rows.length)
                mariadb.query(`DELETE FROM blog WHERE id = ${req.query.id}`, (err, rows, fields) => {
                    fs.unlink("bin" + outer_rows[0].path.replace(HOSTNAME, ""), (inner_err) => {

                        if (err == null) {
                            if (outer_err == null) {
                                if (inner_err == null) {
                                    res.send({
                                        error: false,
                                        data: rows,
                                    })
                                    return
                                }
                                else {
                                    res.send({
                                        error: true,
                                        code: "DV001_SQL-inner_err",
                                        message: "Couldn't complete the whole delete cycle",
                                        sqlMessage: err,
                                        sqlMessageOuter: inner_err,
                                    })
                                    return
                                }
                            }
                            else {
                                res.send({
                                    error: true,
                                    code: "DV001_SQL-outter_err",
                                    message: "Couldn't complete the whole delete cycle",
                                    sqlMessageOuter: outer_err,
                                })
                                return
                            }
                        } else {
                            res.send({
                                error: true,
                                code: "DV001_SQL-err",
                                message: "Couldn't complete the whole delete cycle",
                                sqlMessage: err,
                            })
                            return
                        }
                    })

                });
        })

    } else {
        res.send({
            error: true,
            code: "S002",
            message: "id field element was not found as a query element"
        })
        return
    }
});

// For Single image upload
app.post('/uploadImage', imageUpload.single('image'), (req, res) => {
    const img = req.file.filename;
    const title = req.body.title;
    const description = req.body.description;;
    const author = req.body.author;
    const subTittle = req.body.sub;
    const link = req.body.link;

    //Adding a blog post with a image
    mariadb.query(`INSERT INTO blog(path, author, title, description, created_on,link,subTittle) VALUES('${HOSTNAME}/images/${img}','${author}','${title}', '${description}', DEFAULT,'${link}','${subTittle}')`, (err, result) => {
        if (err) throw err
        res.send('Image uploaded')
        return
    })

    return


}, handleErr)

app.post('/uploadVideo', videoUpload.single('video'), (req, res) => {

    const vid = req.file.filename;



    if (req.body.type == 'blog') {
        const title = req.body.title;
        const description = req.body.description;
        const author = req.body.author;
        const subTittle = req.body.sub;
        const link = req.body.link;

        //Adding a blog post with a video
        mariadb.query(`INSERT INTO blog(path, author, title, description, created_on,link,subTittle) VALUES('${HOSTNAME}/videos/${vid}','${author}','${title}', '${description}', DEFAULT,'${link}','${subTittle}')`, (err, result) => {
            if (err) throw err
            res.send('Video uploaded for blog')
        })
    }
    else if (req.body.type == 'orientation') {
        const faculty = req.body.fac
        const title = req.body.title
        const category = req.body.category
        const fileType = req.body.fileType


        //Adding a video post with a image
        mariadb.query(`INSERT INTO videos(path, tittle, createdAt,category,type,noOfViews) VALUES('${HOSTNAME}/videos/${vid}','${title}', DEFAULT,'${category}','${fileType}',0)`, (err, result) => {
            if (err) throw err

            if (result.insertId) {
                mariadb.query(`INSERT INTO fac_vid VALUES(DEFAULT,${faculty},${result.insertId})`, (err, result) => {
                    if (err) throw err
                    res.send("video for orientation was added")
                })
            }
            return
        })
    }
    return


}, handleErr)

app.get('/', (req, res) => {
    res.send('Not a accessbled Address app...!!!!');
});


app.listen(APP_PORT, () => {
    console.log("********************************************************");
    console.log("* DB: " + DATABASE() + ":3306 DBname:'orientation_db_schema'    *");
    console.log("*           S3 Bucket(U/D) Amazon : by Cheyeza         *");
    console.log("*                   PORT : " + APP_PORT + "                        *");
    console.log("********************************************************");
})

module.exports = app;
