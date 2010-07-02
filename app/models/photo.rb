class Photo < ActiveRecord::Base 
  belongs_to :spot
  # Paperclip
  has_attached_file :data, :styles => {:small => "250x200!", :medium => "350x350!"}
end
