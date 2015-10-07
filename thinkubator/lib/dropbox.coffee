Thinkubator = require "./thinkubator"

class Thinkubator.DropBoxClient
  dropbox  = require('dropbox')

  @options = { download: true, downloadHack: true }
  @dir = "/thinkubator"
  @dbClient = new dropbox.Client
    key: ""
    secret: ""
    sandbox: false
    token       : "",
    tokenSecret : ""


  @dbClient.authDriver new dropbox.AuthDriver.NodeServer(8888)

  @connect:(callback)->
    @dbClient.authenticate (error, client) ->
      unless error
        callback(client) if callback instanceof Function

module.exports = Thinkubator.DropBoxClient