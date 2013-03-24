function SpeechRecognition() {

    var self = this;
    this._commands = [];

    this._interimTranscript = "";
    this._finalTranscript = "";

    this.constructor = function() {
        self._speech = new webkitSpeechRecognition();
        self._speech.continuous = true;
        self._speech.interimResults = true;
        self._speech.onresult = self.onSpeechResult;
        self._speech.onend = self.onSpeechEnd;
        self._speech.onerror = self.onSpeechError;
    }

    this.start = function() {
        self._speech.start();
        console.log("Start speech detection");
    }

    this.onSpeechResult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                self._finalTranscript += event.results[i][0].transcript;
            } else {
                self._interimTranscript += event.results[i][0].transcript;
            }

            for (var command in self._commands) {
                for (var word in self._commands[command].words) {
                    if (self._finalTranscript.indexOf(self._commands[command].words[word]) != -1) {
                        self._commands[command].command.apply(self, [{ "word" : self._commands[command].words[word] }]);
                        self._finalTranscript = "";
                        self._interimTranscript = "";
                    }
                }
            }
        }
    }

    this.addCommand = function(words, command) {
        if ( typeof(words) === "string" ) {
            words = [words];
        }
        self._commands.push( {"words": words, "command": command} );
    }

    this.clearWatchWords = function() {
        self._commands = [];
    }

    this.onSpeechError = function(event) {
        console.log(event)
    }

    this.onSpeechEnd = function() {
        console.log("End");
        self._speech.start();
    }

    this.constructor();
}