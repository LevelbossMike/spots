class Spot < ActiveRecord::Base
  # pagination
  cattr_reader :per_page
  @@per_page = 4
  validates_presence_of :name,:description,:lat,:lng, :on => :create, :message => "can't be blank"
  has_many :comments, :dependent => :destroy
  # Paperclip
  has_attached_file :photo, :styles => {:small => "300x300>", :medium => "250x200!"}
end
