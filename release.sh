#!/usr/bin/env bash

if [ $1 -eq 'osx' ]
  then
    echo 'Building for OSX';
    electron-packager . RoboOpsDashboard --platform=darwin --arch=x64 --version=0.36.5;
else
    echo 'Unsupported platform';
    exit 1;
fi
