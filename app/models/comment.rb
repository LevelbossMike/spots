class Comment < ActiveRecord::Base
  belongs_to :spot
  validates_numericality_of :rating, :on => :create, :message => "is not a number"
  validate :rating_between_1_and_5
  protected
   def rating_between_1_and_5
     errors.add(:rating, 'has to be between 1 and 5') if rating < 1 || rating > 5
  end
end
