class Photo < ActiveRecord::Base 
  belongs_to :spot
  # Paperclip
  has_attached_file :data, :styles => {:mini => "50x50!",:small => "200x200!", :medium => "350x350!"}
end
