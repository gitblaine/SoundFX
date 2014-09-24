class Song < ActiveRecord::Base
	belongs_to :playlists

	validates_presence_of :title
end
