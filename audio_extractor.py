import subprocess
import os
import pafy

isNormalStream = False


def call_from_js(link):
    video = pafy.new(link)
    audio_type = check_audiostreams(video.audiostreams)
    best_audio = video.getbestaudio(preftype=audio_type)
    
    fp = f'./temp/t_aud.{best_audio.extensio}'
    best_audio.download(filepath=fp)
    audio_name = convert_to_mp3(fp) if isNormalStream else fp
    

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
        
