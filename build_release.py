#! python2
# -*- coding: utf-8 -*-

# ////////////////////////////////////////////////
# Logging

import logging

FORMAT = '%(message)s'
logging.basicConfig(format=FORMAT)
_logger = logging.getLogger()
_logger.setLevel(logging.DEBUG)


def log(msg):
    _logger.debug(msg)


def info(msg):
    _logger.info(msg)


def warn(msg):
    _logger.warning(msg)


def err(msg):
    _logger.error(msg)


def exception(msg):
    _logger.exception(msg)

# Logging
#////////////////////////////////////////////////

from os.path import dirname, join, exists
from os import remove, getcwd, chdir
from shutil import rmtree, copytree, copy
import subprocess

OUTPUT_DIR = 'D:/Temp'
PKG_DIR_NAME = 'acoustic-events'
PKR_DIR = join(OUTPUT_DIR, PKG_DIR_NAME)
DIR2COPY = ['public', 'server']
DROPBOX_EXE_DIR = 'C:/Users/zakhar/AppData/Roaming/Dropbox/bin'
DROPBOX_DIR = 'C:/Users/zakhar/Dropbox/Public'


def main():
    # Check the build has been completed
    distDir = join(dirname(__file__), 'dist')
    dirs2copy = [join(distDir, d) for d in DIR2COPY]
    for d in dirs2copy:
        if not exists(d):
            err('Dist is NOT ready. Run the build first.')
            return 1
    # Rem old 'public' and 'server' folders from out dir
    for d in DIR2COPY:
        d2del = join(PKR_DIR, d)
        if exists(d2del):
            rmtree(d2del)
    # Copy 'public' and 'server' folders from 'dist' to out dir
    for d in DIR2COPY:
        copytree(join(distDir, d), join(PKR_DIR, d))
    # Patch outdir\server\config\environment\production.js
    fname = join(PKR_DIR, 'server', 'config', 'environment', 'production.js')
    f = open(fname, 'r')
    oldContent = f.read()
    f.close()
    f = open(fname, 'w')
    newContent = oldContent.replace('mongodb://admin:admin@ds029575.mlab.com:29575/web-starter', 'mongodb://localhost/projects-dev')
    f.write(newContent)
    f.close()
    # Run Dropbox
    subprocess.Popen([join(DROPBOX_EXE_DIR, 'Dropbox.exe')], cwd=DROPBOX_EXE_DIR)
    # Rem old zip if exists
    archFname = PKG_DIR_NAME + ".7z"
    archPath = join(OUTPUT_DIR, archFname)
    if exists(archPath):
        remove(archPath)
    # Zip the out dir
    # 7z a -t7z acoustic-events acoustic-events
    cwd = getcwd()
    chdir(OUTPUT_DIR)
    subprocess.call(['7z', 'a', '-t7z', PKG_DIR_NAME, PKR_DIR], shell=True)
    chdir(cwd)
    # Copy the zip to Dropbox dir
    archOutPath = join(DROPBOX_DIR, archFname)
    if exists(archOutPath):
        remove(archOutPath)
    copy(archPath, DROPBOX_DIR)
    info("DONE")

if __name__ == '__main__':
    main()
