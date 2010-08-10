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
  
  def calc_rating
    @ratings = []
    comments.each do |c|
      @ratings << c.rating
    end
    #fixnums must be divided via fdiv otherwise an integer value would be returned
    @ratings.sum.fdiv(@ratings.size)
  end
  
  def short_description
    length = 150
    if(description.length > length) then
      description.slice(0..(length-6))+" (...)"
    else
      description
    end
  end
    
end
