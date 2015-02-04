class AddSCtoSongs < ActiveRecord::Migration
  def change
  	add_column :songs, :soundcloud_id, :integer
  	add_column :songs, :soundcloud_permalink, :string
  end
end
