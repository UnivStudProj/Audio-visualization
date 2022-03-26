import pafy
import eel

eel.init('web')


# Request from JS
@eel.expose
def fromJS(url):
    # Return error if a link is invalid
    try:
        video = pafy.new(url)
        audio_type = check_audiostreams(video.audiostreams)
        best_audio = video.getbestaudio(preftype=audio_type)
        
        message = {
            'type'          : 'string',
            'url'           : best_audio.url,
            'thumbnail'     : video.getbestthumb(),
            'title'         : video.title,
            'duration'      : video.duration
        }
    except ValueError as e:
        message = { 'type' : 'error', 'text' : str(e)}
    
    # Call JS function
    eel.toJS(message);


def check_audiostreams(audiostreams):
    global isNormalStream
    if not audiostreams:
        raise ValueError('No audiostreams were found')
    for a in audiostreams:
        if a.extension == 'mp3':
            return a.extension
        
    return 'any'


eel.start('index.html');