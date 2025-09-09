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

    local_config_path = basepath + "/etc/config/ftb.ini"
    prod_config_path = "/etc/secrets/ftb.ini"

    
    if os.path.exists(local_config_path):
        ## read from local path
        configpath = local_config_path
    else:
        ## read from render path 
        configpath = prod_config_path

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
        "smtpconfig":{
            "backend": config.get("smtpconfig", "backend"),
            "host": config.get("smtpconfig", "host"),
            "port": config.get("smtpconfig", "port"),
            "use_tls": config.get("smtpconfig", "use_tls"),
            "user": config.get("smtpconfig", "user"),
            "password": config.get("smtpconfig", "password"),
        }
        

    }
    logger.info("getconfig() end")

    return configdict
