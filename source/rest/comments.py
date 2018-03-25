######### Imports for calendar invites

# from __future__ import print_function
# from apiclient import discovery
# from httplib2 import Http
# from oauth2client import file, client, tools


#########


import json
import logging
import math

from lib.bottle import get, post, request, response

from google.appengine.api import users

import models
import GameEngine



#### Calendar Api stuffs

# SCOPES = 'https://www.googleapis.com/auth/calendar'
# store = file.Storage('storage.json')
# creds = store.get()
# if not creds or creds.invalid:
#     flow = client.flow_from_clientsecrets('client_secret.json', SCOPES)
#     creds = tools.run_flow(flow, store)
# GCAL = discovery.build('calendar', 'v3', http=creds.authorize(Http()))

# GMT_OFF = '-07:00'      # PDT/MST/GMT-7

# @post('/generateEvents')
# def generateEvents():
#     logging.info("Generating google calendar invites")
#     user = users.get_current_user()
#     userID = user.user_id()
#     userInfo = models.PrayerWarrior.query().filter(models.PrayerWarrior.userID == userID).fetch(1)
    
#     if userInfo is None or len(userInfo) == 0:
#         logging.info("No days to add to calendar")
#     else:
#         day = 0
#         for time in userInfo[0].days:
#             if time == -1:
#                 day += 1
#                 continue

#             EVENT = {
#                 'summary': 'Pray for the Persecuted Church',
#                 'start':  {'dateTime': generateStartDateStringFromTime(day, time)},
#                 'end':    {'dateTime': generateStopDateStringFromTime(day, time)},
#             }

#             e = GCAL.events().insert(calendarId='primary',
#                     sendNotifications=True, body=EVENT).execute()
#             day += 1     

#     return json.dumps([])   
          

def generateStartDateStringFromTime(i, j):
    return '2018-03-%sT%s:%s:00%s' % (getDayFromIndex(i), getHoursFromIndex(j), getMinutesFromIndex(j), GMT_OFF)

def generateStopDateStringFromTime(i, j):
    return '2018-03-%sT%s:%s:00%s' % (getDayFromIndex(i), getHoursFromIndex(j+1), getMinutesFromIndex(j+1), GMT_OFF)

def getHoursFromIndex(j):
    if j < 4:
        return "12"
    if j <= 52:
        return str(1 + ((j - 5) / 4))
    return str(1 + ((j - 53) / 4))    

def getMinutesFromIndex(j):
    if j % 4 == 1:
        return "00"
    if j % 4 == 1:
        return "15"
    if j % 4 == 2:
        return "30"
    return "45"            

def getDayFromIndex(i):
    if i == 0:
        return "08"
    if i == 1:
        return "09"
    if i == 1:
        return "10"
    if i == 1:
        return "11"
    if i == 1:
        return "12"
    if i == 1:
        return "13"    
    return "14"

######


@post('/login')
def login():
    userID = request.json.get('userID')
    userInfo = models.User.query().filter(models.User.userID == userID).fetch(1)
    return models.login_to_json(userInfo[0])


@post('/prayerUpdate')
def prayerUpdate():
    user = users.get_current_user()
    userID = user.user_id()
    userInfo = models.PrayerWarrior.query().filter(models.PrayerWarrior.userID == userID).fetch(1)
    
    if userInfo is None or len(userInfo) == 0:
        logging.info("prayerUpdate")
        logging.info(request.json.get('days'))
        user = models.PrayerWarrior(userID=userID, days=request.json.get('days'))
        user.put()
    else:
        userInfo[0].days = request.json.get('days')
        userInfo[0].put()

    return json.dumps([])    

@get('/prayers/')
def get_all_prayers():
    logging.info("Getting all the prayers")
    prayers = models.PrayerWarrior.query().fetch()

    to_return = [[0 for x in range(7)] for y in range(96)] 

    for prayer in prayers:
        i = 0
        for time in prayer.days:
            if time == -1:
                i += 1
                continue
            # if there is a time selected add it to our counter    
            to_return[time][i] += 1
            i += 1


    response.content_type = 'application/json'
    return json.dumps(to_return)

@get('/myprayers/')
def get_my_prayers():
    user = users.get_current_user()
    userID = user.user_id()
    userInfo = models.PrayerWarrior.query().filter(models.PrayerWarrior.userID == userID).fetch(1)

    to_return = [-1 for x in range(7)] 
    response.content_type = 'application/json'

    if userInfo is None or len(userInfo) == 0:
        logging.info("myprayers")
        logging.info(to_return)
        return json.dumps(to_return)

    if len(userInfo[0].days) > 0:
        current = 0
        for day in userInfo[0].days:
            to_return[current] = day
            current += 1

    return json.dumps(to_return)

# @post('/calendar/')
# def set_calendar_invites():
#     # 
#     event = {
#         'summary': 'Google I/O 2015',
#         'location': '800 Howard St., San Francisco, CA 94103',
#         'description': 'A chance to hear more about Google\'s developer products.',
#         'start': {
#             'dateTime': '2015-05-28T09:00:00-07:00',
#             'timeZone': 'America/Los_Angeles',
#         },
#         'end': {
#             'dateTime': '2015-05-28T17:00:00-07:00',
#             'timeZone': 'America/Los_Angeles',
#         },
#         'recurrence': [
#             'RRULE:FREQ=DAILY;COUNT=2'
#         ],
#         'attendees': [
#             {'email': 'lpage@example.com'},
#             {'email': 'sbrin@example.com'},
#         ],
#         'reminders': {
#             'useDefault': False,
#             'overrides': [
#             {'method': 'email', 'minutes': 24 * 60},
#             {'method': 'popup', 'minutes': 10},
#             ],
#         },
#     }

#     event = service.events().insert(calendarId='primary', body=event).execute()
#     print 'Event created: %s' % (event.get('htmlLink'))