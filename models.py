import logging

from google.appengine.ext import ndb


class Comment(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    text = ndb.StringProperty()
    author = ndb.StringProperty()

class Gameboard(ndb.Model):
    hasStarted = ndb.BooleanProperty()
    gameID = ndb.IntegerProperty()
    isWhite = ndb.BooleanProperty()
    promotions = ndb.JsonProperty()
    timestamp = ndb.DateTimeProperty(auto_now_add=True)
    board = ndb.JsonProperty()
    lastMove = ndb.IntegerProperty()
    loser = ndb.IntegerProperty()
    whiteId = ndb.StringProperty()
    blackId = ndb.StringProperty()

class User(ndb.Model):
    userID = ndb.IntegerProperty()
    alias = ndb.StringProperty("Anonymous")
    spriteURL = ndb.StringProperty()
    games = ndb.JsonProperty()
    kingURL = ndb.StringProperty()
    queenURL = ndb.StringProperty()
    rookURL = ndb.StringProperty()
    bishopURL = ndb.StringProperty()
    knightURL = ndb.StringProperty()
    pawnURL = ndb.StringProperty()


def get_last_game_to_json(game, ourTeam):
    return {
        'hasStarted': game.hasStarted,
        'gameID': game.gameID,
        'isWhite': game.isWhite,
        'ourTeam': ourTeam,
        'board': game.board,
        'lastMove': game.lastMove,
        'loser': game.loser,
        'promoted': game.promoted
    }

def comment_to_json(comment):
    return {
        'key': comment.key.urlsafe(),
        'created': str(comment.created),
        'text': comment.text,
        'author': comment.author
    }

def move_response_to_json(move, board, checkmate, checkLocs, promotions):
    return {
        'move': move,
        'board': board,
        'checkmate': checkmate,
        'checkLocs': checkLocs,
        'promotions': promotions
    }

def new_game_to_json(team, id):
    return {
        'team': team,
        'id': id
    }

def opponent_joined_to_json(joined):
    return {
        'joined': joined
    }


def opponent_moved_to_json(moved, board, checkmate, pawnLocs, checkLocs, isWhite):
    return {
        'moved': moved,
        'board': board,
        'checkmate': checkmate,
        'pawnLocs': pawnLocs,
        'checkLocs': checkLocs,
        'isWhite': isWhite
    }

def board_to_json(board, loser):
    return {
        'board': board,
        'loser': loser
    }

def login_to_json(userInfo):
    return {
        'alias': userInfo.alias,
        'spriteURL': userInfo.spriteURL,
        'games': userInfo.games,
        'kingURL': userInfo.kingURL,
        'queenURL': userInfo.queenURL,
        'rookURL': userInfo.rookURL,
        'bishopURL': userInfo.bishopURL,
        'knightURL': userInfo.knightURL,
        'pawnURL': userInfo.pawnURL
    }
