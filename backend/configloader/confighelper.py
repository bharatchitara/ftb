__author__ = "Bharat Chitara"
__copyright__ = "Copyright 2024"
__version__ = "1.0"
__docformat__ = "epytext en"

import ast
import configparser
import logging
import os


logger = logging.getLogger(__name__)
configdict =  {}


def getconfig():
    '''
    returns the config dict with all the configurations
    return type : config dictionary
    '''
    logger.info("getconfig() start")

    config = configparser.ConfigParser()
    config.sections()
    basepath = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    print(basepath)
    configpath = basepath + "/etc/config/ftb.ini"

    config.read(configpath)

    configdict = {
        
        "toolmysql":{
            "user": config.get("toolmysql", "user"),
            "password": config.get("toolmysql", "password"),
            "host": config.get("toolmysql", "host"),
            "name": config.get("toolmysql", "name"),
            "port": config.get("toolmysql", "port"),
            "engine": config.get("toolmysql", "engine"),
        },
        
        "django": {
            "secret_key": config.get("django", "secret_key"),
            "debug": eval(config.get("django", "debug")),
            "allowedhosts": config.get("django", "allowedhosts"),
            "languagecode": config.get("django", "languagecode"),
            "timezone": config.get("django", "timezone"),
            "useI18N": eval(config.get("django", "useI18N")),
            "useL10N": eval(config.get("django", "useL10N")),
            "useTZ": eval(config.get("django", "useTZ")),
        },
        

    }
    logger.info("getconfig() end")

    return configdict
