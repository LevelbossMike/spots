class Spot < ActiveRecord::Base
  validates_presence_of :name,:description,:lat,:lng, :on => :create, :message => "can't be blank"
  # Paperclip
  has_attached_file :photo, :styles => {:small => "300x300>", :medium => "500x500>"}
end
