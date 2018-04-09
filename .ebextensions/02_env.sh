#!/bin/bash

cp /usr/share/zoneinfo/Asia/Singapore /etc/localtime

mkdir -p /var/log/deploy/
LOGFILE="/var/log/deploy/02_env.log"

AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_S3} AWS_SECRET_ACCESS_KEY=${AWS_SECRET_KEY_S3} aws s3 cp s3://styletribute-deploy/st-api/server/env.${ENV_NAME} .server/ >> ${LOGFILE} 2>&1
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_BEANSTALK} AWS_SECRET_ACCESS_KEY=${AWS_SECRET_KEY_BEANSTALK} aws s3 ls >> ${LOGFILE} 2>&1

mv .server/env.${ENV_NAME} .env  >> ${LOGFILE} 2>&1
