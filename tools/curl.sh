#!/bin/bash

curl -d '{
   "to": "dMol0iFxSumCd8KHwffugc:APA91bG5jnlAvoXT3DTFetjQfQNsIs9a9qejSpsZ_GHCXGYjVHDujepu8Qrss8_jj1JBqGrGGLKcnhqqUamBzAVx5bHh0yT-vYqXvdLJvOdGuEEFHNOHU7vojjzE3741kl46s19cZPqd",
   "notification": {
     "title" : "Call from Michail",
     "body" : "Call",
     "callUUID": "9e6bfeee-d58f-4eed-8906-fe3bd534dcf8",
     "username": "Michail",
     "avatarURL": "https://fra1.digitaloceanspaces.com/wevive-staging/user/a2ef9c09-d3c2-4118-9c26-27d50c145fd9.jpg",
   },
   "android": {
       "titties": "Nope",
   },
   "data" : {
       "callUUID": "9e6bfeee-d58f-4eed-8906-fe3bd534dcf8",
       "username": "Michail",
       "avatarURL": "https://fra1.digitaloceanspaces.com/wevive-staging/user/a2ef9c09-d3c2-4118-9c26-27d50c145fd9.jpg"
    },
    "priority": "high",
    "android":{
      "priority": "high"
    }
}' \
-i -H "Application/json" \
-H "Content-type: application/json" \
-H "Authorization: key=AAAAn1YBiQs:APA91bH-F_qtT5RRDi30uoraZb5Ctzbu8QlU4duPXqb2BR0uJA6zdNlnHarJsJPr4kx8mx_v4G7hM-0H5_njBMIt2ZUkHrwEFkunhsQVT2V5DQJE8w8ruLF5ZLJ64R-yWiT6dqzGqOCx" \
-X POST https://fcm.googleapis.com/fcm/send

