class FixColumnName < ActiveRecord::Migration
  def change
  	rename_column :songs, :time, :duration
  end
end
