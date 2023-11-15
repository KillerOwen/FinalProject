from flask import Flask, render_template, send_from_directory, jsonify
import os
import random

app = Flask(__name__)

# Define the path to your audio files
audio_path = os.path.join(app.root_path, 'static/audio')
songs = sorted(os.listdir(audio_path))  # Sort the list

# Keep track of the current position in the original order
current_song_index = 0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/audio/<path:filename>')
def download_file(filename):
    return send_from_directory(audio_path, filename)

@app.route('/shuffle')
def shuffle():
    random_song = random.choice(songs)
    return jsonify({'song': random_song, 'song_name': os.path.splitext(random_song)[0]})

@app.route('/queue')
def queue():
    global current_song_index
    next_song = songs[current_song_index]
    current_song_index = (current_song_index + 1) % len(songs)
    return jsonify({'song': next_song, 'song_name': os.path.splitext(next_song)[0]})

@app.route('/next-song')
def next_song():
    next_song = songs.pop(0) if songs else None
    return jsonify({'song': next_song, 'song_name': os.path.splitext(next_song)[0]})

@app.route('/prev-song')
def prev_song():
    prev_song = songs.pop() if songs else None
    return jsonify({'song': prev_song, 'song_name': os.path.splitext(prev_song)[0]})

@app.route('/song-list')
def get_song_list():
    return jsonify({'songs': songs})

if __name__ == '__main__':
    app.run(debug=True)
