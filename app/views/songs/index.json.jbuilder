json.array!(@songs) do |song|
  json.extract! song, :id, :title, :artist, :album, :time, :genre
  json.url song_url(song, format: :json)
end
