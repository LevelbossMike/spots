class CreateSpots < ActiveRecord::Migration
  def self.up
    create_table :spots do |t|
      t.string :name
      t.text :description
      t.decimal :lat, :precision => 15, :scale => 10
      t.decimal :lng, :precision => 15, :scale => 10
      t.string :photo_file_name
      t.string :photo_content_type
      t.integer :photo_file_size
      t.datetime :photo_updated_at

      t.timestamps
    end
  end

  def self.down
    drop_table :spots
  end
end
