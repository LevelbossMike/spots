class Spot < ActiveRecord::Base
  # don't send root element when calling to_json method on spot
  ActiveRecord::Base.include_root_in_json = false
  # pagination
  cattr_reader :per_page
  @@per_page = 4
  validates_presence_of :name,:description,:lat,:lng, :on => :create, :message => "can't be blank"
  has_many :comments, :dependent => :destroy
  has_many :photos, :dependent => :destroy
  # nested attributes
  accepts_nested_attributes_for :photos
    
end
