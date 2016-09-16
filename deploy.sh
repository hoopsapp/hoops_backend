#!/bin/sh

PROJECT=hoops-backend
DATE=`date +%m-%d-%y-%H-%M`
BUNDLE_DIR="$PROJECT-$DATE"
REMOTE=ec2-user@54.76.147.204

DEPLOY="
mkdir $BUNDLE_DIR;
cd $BUNDLE_DIR;
tar zxvf ../${PROJECT}.tar.gz --strip-components=1;
cd programs/server/;
npm install;
cd;
rm $PROJECT;
ln -s $BUNDLE_DIR $PROJECT;
forever restartall;
"
meteor build ../build --server 54.76.147.204
scp ../build/${PROJECT}.tar.gz $REMOTE:
ssh $REMOTE $DEPLOY 
