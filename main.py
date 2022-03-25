import subprocess
import os
import pafy
import eel

eel.init('web')
isNormalStream = False


def messageFormat(messageType, messageText):
    message = {
        'type' : messageType,
        'text' : messageText
    }
    
    return message


# Request from JS
@eel.expose
def fromJS(url):
    # Return error if a link is invalid
    try:
        video = pafy.new(url)
        audio_type = check_audiostreams(video.audiostreams)
        best_audio = video.getbestaudio(preftype=audio_type)
        message = messageFormat('string', best_audio.url)
    except ValueError as e:
        message = messageFormat('error', str(e))
    # Call JS function
    eel.toJS(message);
    

def convert_to_mp3(filePath):
    global isNormalStream
    abs_path = os.path.abspath(filePath)
    subprocess.call(
        ['ffmpeg', '-i', abs_path, '-hide_banner', abs_path[:abs_path.index('.')] + '_n.mp3']
    )
    os.remove(filePath)
    isNormalStream = False 
    
    return './temp/t_aud_n.mp3'


def check_audiostreams(audiostreams):
    global isNormalStream
    if not audiostreams:
        isNormalStream = True
        return
    for a in audiostreams:
        if a.extension == 'mp3':
            return a.extension
        
    return 'any'


eel.start('index.html');