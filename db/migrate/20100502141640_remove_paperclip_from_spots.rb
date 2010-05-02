class RemovePaperclipFromSpots < ActiveRecord::Migration
  def self.up
     remove_column :spots, :photo_file_name
     remove_column :spots, :photo_content_type
     remove_column :spots, :photo_file_size
     remove_column :spots, :photo_updated_at
  end

  def self.down
     add_column :spots, :photo_file_name, :string
     add_column :spots, :photo_content_type, :string
     add_column :spots, :photo_file_size, :integer
     add_column :spots, :photo_updated_at, :datetime
  end
end
