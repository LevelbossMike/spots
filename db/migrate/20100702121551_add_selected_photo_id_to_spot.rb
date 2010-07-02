class AddSelectedPhotoIdToSpot < ActiveRecord::Migration
  def self.up
    add_column :spots, :selected_photo_id, :integer
  end

  def self.down
    remove_column :spots, :selected_photo_id
  end
end
