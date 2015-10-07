app     = require('express')()
http    = require('http').Server(app)
io      = require('socket.io')(http)
dropbox = require("./thinkubator/lib/dropbox")
_       = require("underscore")

class Application

  constructor: ->
    @pictures_array = {}
    @boot_server()
    @connect_dropbox()
    io.on "connection", =>
      console.log "client connected"
      @scan_dir()


  boot_server: ->
    http.listen 3000, ->
      console.log('listening on *:3000')

  connect_dropbox: ->
    dropbox.connect (client) =>
      @client = client

      setInterval ( =>
        @scan_dir()
      ),2000

  scan_dir: ->
    @client.readdir dropbox.dir, {}, (error, files, stats) =>
      file_counter = 0
      @clean_if_removed(files)
      i = 0
      _(files).each (file, i)=>
        @client.makeUrl "#{dropbox.dir}/#{file}", dropbox.options , (error, res) =>
          if res
            @pictures_array[file] = res.url
            file_counter++
            @send_data() if file_counter == files.length

  clean_if_removed:(files)->
    # console.log files.length, _(@pictures_array).size()
    # if files.length < _(@pictures_array).size()
    #   for file in files
    #     console.log @pictures_array
    #     console.log @pictures_array[file]
    #     unless _(@pictures_array).contains file
    #       # console.log "removed!"
    #       # console.log file
    #       # @remove(file)


  send_data: ->
    io.emit('pictures_ready', { pictures: @pictures_array });

  remove:(removed_picture) ->
    @pictures_array[removed_picture] = undefined
    io.emit('picture_removed', removed_picture: removed_picture);


new Application