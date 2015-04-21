#!/bin/sh

rm -r dist
mkdir dist
git archive --format zip --output dist/sketchfab.zip master
