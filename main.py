import subprocess
import os
import pafy
import eel

eel.init('web')
isNormalStream = False
message = {
    'type' : None,
    'text' : None
}


# Request from JS
@eel.expose
def fromJS(url):
    res = getAudio(url)

    # Call JS function
    eel.toJS(res);
    

def messageFormat(messageType, messageText):
    global message
    message['type'] = messageType
    message['text'] = messageText


def getAudio(link):
    try:
        video = pafy.new(link)
    except ValueError as e:
        return {'type' : 'error', 'text' : str(e)}
        
    audio_type = check_audiostreams(video.audiostreams)
    best_audio = video.getbestaudio(preftype=audio_type)
    
    fp = f'./temp/t_aud.{best_audio.extension}'
    best_audio.download(filepath=fp)
    convert_to_mp3(fp) if isNormalStream else fp
    
    messageFormat('string', best_audio.url)
    
    return message
    
    

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