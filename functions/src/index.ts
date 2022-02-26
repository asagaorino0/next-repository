import * as line from '@line/bot-sdk';
import {
    writeBatch, doc,
    //getFirestore,increment,setDoc ,collection, collectionGroup, query, where, onSnapshot,  , Timestamp, addDoc 
} from 'firebase/firestore'
// import { db } from './firebase'


import { initializeApp, } from "firebase/app";
import { getFirestore } from "firebase/firestore"
require('dotenv').config();
const functions = require('firebase-functions');
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

////////////////////////////////////////////////
const firebaseConfig = {
    apiKey: functions.config().someservice.firebase.apikey,
    authDomain: functions.config().someservice.firebase.authdomain,
    projectId: functions.config().someservice.firebase.projectid,
    databaseURL: functions.config().someservice.firebase.databaseurl,
    storageBucket: functions.config().someservice.firebase.storagebucket,
    messagingSenderId: functions.config().someservice.firebase.messagingsenderid,
    appId: functions.config().someservice.firebase.appid,
    measurementId: functions.config().someservice.firebase.measurementid,
    secret_token: functions.config().stripe.secret_token,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
/////////////////////////////////////////////////
const config = {
    channelAccessToken: functions.config().line.channel_access_token,
    channelSecret: functions.config().line.channel_secret
};
const client = new line.Client(config);

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req: any, res: any) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({ original: original });
    // Send back a message that we've successfully written the message
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// const { Stripe } = require('stripe');
// const stripe = new Stripe(functions.config().stripe.secret_token, {
//     apiVersion: '2020-08-27',
// });

export const onCheckout = functions.firestore
    .document('users/{uid}/tomare/{cusPayId}')
    .onUpdate(async (change: any, context: any) => {
        const newValue = change.after.data();
        // .onCreate(async (snap: any, context: any) => {
        //     const newValue = snap.data();        
        const tomareId = newValue.tomareId
        const uid = newValue.uid;
        const newPay = newValue.cusPay
        const batch = writeBatch(db);
        console.log('pay::::::', newPay, tomareId, uid,)
        // const stripe = require('stripe')(functions.config().stripe.secret_token);
        try {
            const setRef = doc(db, "users", `${uid}`, "tomare", `${tomareId}`);
            batch.set(setRef, { pay: newPay }, { merge: true });
            await batch.commit();
        }
        catch (err) {
            console.log(err)
        }
    });

exports.helloworld = functions.https.onRequest(async (req: any) => {
    // Send back a message that we've successfully written the message
    var data = req.body;
    console.log(data, '======');
    const message: any = {
        type: 'text',
        text: 'Hello,'
    };
    const template: any = {
        type: "template",
        altText: "This is a buttons template",
        template: {
            type: "buttons",
            thumbnailImageUrl: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/FullSizeRender.mov?alt=media&token=5431ae0b-da1f-4c78-8691-12d3593b89e2",
            imageAspectRatio: "rectangle",
            imageSize: "cover",
            imageBackgroundColor: "#FFFFFF",
            title: "Menu",
            text: "Please select",
            defaultAction: {
                type: "uri",
                label: "View detail",
                uri: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/FullSizeRender.mov?alt=media&token=5431ae0b-da1f-4c78-8691-12d3593b89e2",
                imageUrl: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/P_hoka.png?alt=media&token=0d98a224-f460-4527-8208-209f6a52a55c"

            },
            actions: [
                {
                    "type": "datetimepicker",
                    "label": "Select date",
                    "data": "storeId=12345",
                    "mode": "datetime",
                    "initial": "2017-12-25t00:00",
                    "max": "2018-01-24t23:59",
                    "min": "2017-12-25t00:00"
                },
                {
                    "type": "camera",
                    "label": "Camera",
                    imageUrl: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/P_hoka.png?alt=media&token=0d98a224-f460-4527-8208-209f6a52a55c"
                },
                {
                    "type": "location",
                    "label": "Location"
                }]
        }
    }
    const uid = "Uda1c6a4e5b348c5ba3c95de639e32414"
    client.pushMessage(
        uid,
        [message,
            template
        ],
    )
        .then(() => {
            console.log('send message success!!!');
        })
        .catch((err: any) => {
            // error handling
            console.log('🚀 ~ file: Login.tsx ~ line 21 ~ sendMessage ~ err', err);
        });
});


export const onUpdateChip = functions.firestore
    .document('users/{uid}/tomare/{chip}')
    .onUpdate(async (change: any, context: any) => {
        const newValue = change.after.data();
        const newChip = newValue.chip;
        const uid = newValue.uid;
        const batch = writeBatch(db);
        try {
            const setRef = doc(db, "users", uid);
            batch.set(setRef, { newChip }, { merge: true });
            await batch.commit();
        }
        catch (err) {
            console.log(err)
        }
    });
export const onNewChip = functions.firestore
    .document('users/{newChip}')
    .onUpdate(async (change: any, context: any) => {
        // const value = change.befor.data();
        const newValue = change.after.data();
        const newChip = newValue.newChip;
        const uid = newValue.uid;
        const batch = writeBatch(db);
        try {
            // chipの合計
            let chips =
                newValue.chip += newChip;
            // usersの更新
            let params = {};
            if (newValue.chip !== chips) {
                params = {
                    chip: newValue.chip += newChip,
                    newChip: 0,
                }
            } else if (newValue.chip === chips) {
                params = {
                    chip: chips,
                    newChip: 0,
                }
            }
            const setRef = doc(db, "users", uid);
            batch.set(setRef, params, { merge: true });
            await batch.commit();
        }
        catch (err) {
            console.log(err)
        }
    });
export const onUpdateStar = functions.firestore
    .document('users/{uid}/tomare/{star}')
    .onUpdate(async (change: any, context: any) => {
        const newValue = change.after.data();
        const newStar = newValue.star;
        const uid = newValue.uid;
        console.log(uid, 'star:', newStar)
        const batch = writeBatch(db);
        try {
            const setRef = doc(db, "users", uid);
            batch.set(setRef, { newStar: newStar }, { merge: true });
            await batch.commit();
        }
        catch (err) {
            console.log(err)
        }
    });

export const onNewStar = functions.firestore
    .document('users/{newStar}')
    .onUpdate(async (change: any, context: any) => {
        const newValue = change.after.data();
        const newStar = newValue.newStar;
        const uid = newValue.uid;
        const batch = writeBatch(db);
        try {
            // // 平均starの計算
            let { star1 = newValue.star1, star2 = newValue.star2, star3 = newValue.star3, star4 = newValue.star4, star5 = newValue.star5 } = newStar;
            if (newValue.newStar === 1) {
                star1 += 1;
            } else if (newValue.newStar === 2) {
                star2 += 1;
            } else if (newValue.newStar === 3) {
                star3 += 1;
            } else if (newValue.newStar === 4) {
                star4 += 1;
            } else if (newValue.newStar === 5) {
                star5 += 1;
            }
            let star =
                (star1 + star2 * 2 + star3 * 3 + star4 * 4 + star5 * 5) /
                (star1 + star2 + star3 + star4 + star5);
            star = Math.round(star * 100) / 100
            // // usersの更新
            let params = {};
            if (newValue.newStar === 1) {
                params = {
                    star1,
                    starA: (star1 + star2 * 2 + star3 * 3 + star4 * 4 + star5 * 5),
                    stars: (star1 + star2 + star3 + star4 + star5),
                    star: star,
                    newStar: 0
                }
            } else if (newValue.newStar === 2) {
                params = {
                    star2,
                    starA: (star1 + star2 * 2 + star3 * 3 + star4 * 4 + star5 * 5),
                    stars: (star1 + star2 + star3 + star4 + star5),
                    star: star,
                    newStar: 0
                }
            } else if (newValue.newStar === 3) {
                params = {
                    star3,
                    starA: (star1 + star2 * 2 + star3 * 3 + star4 * 4 + star5 * 5),
                    stars: (star1 + star2 + star3 + star4 + star5),
                    star: star,
                    newStar: 0
                };
            } else if (newValue.newStar === 4) {
                params = {
                    star4,
                    starA: (star1 + star2 * 2 + star3 * 3 + star4 * 4 + star5 * 5),
                    stars: (star1 + star2 + star3 + star4 + star5),
                    star: star,
                    newStar: 0
                }
            } else if (newValue.newStar === 5) {
                params = {
                    star5,
                    starA: (star1 + star2 * 2 + star3 * 3 + star4 * 4 + star5 * 5),
                    stars: (star1 + star2 + star3 + star4 + star5),
                    star: star,
                    newStar: 0
                }
            }
            const setRef = doc(db, "users", uid);
            batch.set(setRef, params, { merge: true });
            await batch.commit();
            console.log(`aveStar`, star)

        }
        catch (err) {
            console.log(err)
        }
    });

export const updateYoyaku = functions.firestore
    // .document('users/{uid}/tomare/{uid}{am_pm}')
    // .onCreate((snap, context) => {
    //     const newValue = snap.data();
    //     const gappi = newValue.gappi;
    .document('users/{uid}/tomare/{timestamp}')
    .onUpdate((change: any, context: any) => {
        const newValue = change.after.data();
        const gappi = newValue.gappi;
        const uid = newValue.uid;
        const am_pm = newValue.am_pm;
        const yoyakuMenu = newValue.yoyakuMenu + 'でオファーがありました'
        // const message: any = {
        //     type: 'text',
        //     text: `${yoyakuMenu === "" && '約枠を設定しました '}${newValue.yoyakuMenu !== "" && yoyakuMenu}`
        // };
        const template: any = {
            type: "template",
            altText: "予約枠変更のお知らせ",
            template: {
                type: "buttons",
                thumbnailImageUrl: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/P_pv.png?alt=media&token=3c9ba03e-d565-4b14-bf3a-ba46ed410895",
                imageAspectRatio: "rectangle",
                imageSize: "cover",
                imageBackgroundColor: "#FFFFFF",
                title: `${gappi}/${am_pm}のご予約枠`,
                text: '予約枠を変更しました' + `${newValue.yoyakuMenu !== "" && yoyakuMenu}`,
                defaultAction: {
                    type: "uri",
                    label: "View detail",
                    uri: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/PV.mp4?alt=media&token=fb1d46d8-5d71-4e0e-9738-790d91c17154"
                },
                actions: [
                    // {
                    //     type: "datetimepicker",
                    //     label: "Select date",
                    //     data: "entryId=12345",
                    //     mode: "date",
                    //     initl: `${gappi}`,
                    //     max: `${gappi}t20:00`,
                    //     min: `${gappi}t08:00`,
                    // },
                    {
                        type: "location",
                        label: "Location"
                    },
                    {
                        type: "cameraRoll",
                        label: "Camera roll"
                    },
                    {
                        type: "uri",
                        label: "登録内容の確認と変更",
                        uri: "https://redux-next.vercel.app/PageC"
                    }]
            }
        }
        client.pushMessage(
            uid,
            [template],
        )
            .then(name => console.log(name))
            .catch(e => console.log(e))
    });



export const createTomare = functions.firestore
    .document('users/{uid}/tomare/{menu}')
    .onCreate((snap: any, context: any) => {
        const newValue = snap.data();
        const gappi = newValue.gappi;
        const uid = newValue.uid;
        const am_pm = newValue.am_pm;
        const make = newValue.make;
        const nail = newValue.nail;
        const este = newValue.este;
        const sonota = newValue.sonota;
        // const img_make: any = { src: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/P_make.png?alt=media&token=eeaf12cd-39be-4fda-8945-ec2bcb1b24dd", alt: "ケアメイク", style: { width: '60px', height: '45px' } }
        // const img_nail: any = { src: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/P_nail.png?alt=media&token=42117e21-66df-4049-a948-46840912645a", alt: "ケアネイル", style: { width: '60px', height: '45px' } }
        // const img_este: any = { src: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/P_este.png?alt=media&token=5fe75701-ec95-424a-8ba7-a547e313dd19", alt: "ケアエステ", style: { width: '60px', height: '45px' } }
        // const img_sonota: any = { src: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/P_hoka.png?alt=media&token=0d98a224-f460-4527-8208-209f6a52a55c", alt: "その他", style: { width: '60px', height: '45px' } }

        const template: any = {
            type: "template",
            altText: "予約枠登録のお知らせ",
            template: {
                type: "buttons",
                thumbnailImageUrl: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/P_pv.png?alt=media&token=3c9ba03e-d565-4b14-bf3a-ba46ed410895",
                imageAspectRatio: "rectangle",
                imageSize: "cover",
                imageBackgroundColor: "#FFFFFF",
                title: `${gappi}/${am_pm}のご予約枠`,
                text: `${make === true && 'ケアメイク '}${nail === true && 'ケアネイル '
                    }${este === true && 'ケアエステ '}${`${sonota}`.length !== 0 && 'その他'} `,
                // text: `${ make === true && img_make }${ nail === true && img_nail }${ este === true && img_este }${ `${sonota}`.length !== 0 && img_sonota } `,
                // text: "オファーを楽しみにお待ちください",
                defaultAction: {
                    type: "uri",
                    label: "View detail",
                    uri: "https://firebasestorage.googleapis.com/v0/b/next-app-db888.appspot.com/o/PV.mp4?alt=media&token=4361cf16-3082-4944-8bb7-c7418fddc9f7"
                },
                actions: [
                    // // {
                    // //     type: "postback",
                    // //     label: "Buy",
                    // //     data: "action=buy&itemid=123"
                    // // },
                    // // {
                    // //     type: "postback",
                    // //     label: "Add to cart",
                    // //     data: "action=add&itemid=123"
                    // // },
                    // {
                    //     type: "cameraRoll",
                    //     label: "Camera roll"
                    // },
                    {
                        type: "uri",
                        label: "登録内容の確認と変更",
                        uri: "https://redux-next.vercel.app/pageC"
                    }]
            }
        }
        client.pushMessage(
            uid,
            [template],
        )
            .then(namae => console.log(namae))
            .catch(e => console.log(e))
    });


exports.helloLine = functions.https.onRequest(async (req: any, res: any) => {
    // Send back a message that we've successfully written the message
    var data = req.body;
    console.log(data, '======');
    const message: any = {
        type: 'text',
        text: 'Hello,'
    };
    const uid = "Uda1c6a4e5b348c5ba3c95de639e32414"
    client.pushMessage(
        uid,
        [message],
    )
        .then(() => {
            console.log('send message success!!!');
        })
        .catch((err: any) => {
            console.log('🚀 ~ file: Login.tsx ~ line 21 ~ sendMessage ~ err', err);
        });
});

// const app = express();
// app.post('/', line.middleware(config), (req, res) => {
export const lineBot = functions.https.onRequest((req: any, res: any) => {
    Promise.all(req.body.events.map(handleEvent))
        .then(() => res.status(200).end())
        .catch((err) => {
            console.error(err);
            res.status(500).end()
        })
});
async function handleEvent(event: any) {
    return client.replyMessage(event.replyToken, { type: "text", text: event.message.text + "ね" })
    //ユーザから送られた各メッセージに対する処理を実装する。
    //https://developers.line.biz/ja/reference/messaging-api/#message-event を参照。
    // switch (event.message.type) {
    //     case 'text':
    //         return client.replyMessage(event.replyToken, { type: "text", text: event.message.text });
    //     case 'image':
    //         return client.replyMessage(event.replyToken, { type: "text", text: '画像を受け取りました。' });
    //     case 'video':
    //         return client.replyMessage(event.replyToken, { type: "text", text: '動画を受け取りました。' });
    //     case 'audio':
    //         return client.replyMessage(event.replyToken, { type: "text", text: '音声を受け取りました。' });
    //     case 'file':
    //         return client.replyMessage(event.replyToken, { type: "text", text: 'ファイルを受け取りました。' });
    //     case 'location':
    //         return client.replyMessage(event.replyToken, { type: "text", text: '位置情報を受け取りました。' });
    //     case 'sticker':
    //         return client.replyMessage(event.replyToken, { type: "text", text: 'スタンプを受け取りました。' });
    //     default:
    //         return Promise.resolve(null);
    // }
}
// export const lineBot = functions.https.onRequest(app);


// const replyToken = event.replyToken

// // イベントの処理
// switch (event.type) {
//   case 'follow':
//     return 'フォローされました'

//   case 'unfollow':
//     return 'フォロー解除されました'

//   case 'message':
//     const message = event.message
//     let text
//     switch (message.type) {
//       case 'image':
//         // 画像を受信した際の処理
//         return '画像を文字起こししました'

//       case 'audio':
//         // 音声を受信した際の処理
//         return '音声を文字起こししました'

//       case 'video':
//         // 動画を受信した際の処理
//         return '動画を文字起こししました'

//       default:
//         // 画像、音声、動画以外を受信した際の処理
//         text = '画像、音声、動画を送信していてください'
//         await replyText(replyToken, text)
//         return '画像、音声、動画以外を受信'
//     }

//   default:
//     return 'その他'
// }

// const [text, setText] = useState<string>('');
exports.getTextArray = (text: string) => {
    const texts = []
    if (text.length > 2000) {
        while (text.length > 2000) {
            texts.push(text.substr(0, 2000))
            text = text.slice(2000, -1)
        }
    }
    texts.push(text)
    return texts
}
exports.getContentBuffer = (messageId: string) => {
    return new Promise((resolve, reject) => {
        client.getMessageContent(messageId).then(stream => {
            const content: any = []
            stream
                .on('data', chunk => {
                    content.push(Buffer.from(chunk))
                })
                .on('error', reject)
                .on('end', () => {
                    resolve(Buffer.concat(content))
                })
        })
    })
}

