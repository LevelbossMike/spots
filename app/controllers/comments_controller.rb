class CommentsController < ApplicationController
  def create
    @spot = Spot.find(params[:spot_id])
    @comment = @spot.comments.create(params[:comment])
    respond_to do |format|
      format.html {redirect_to spot_path(@spot)}
      format.js
    end
  end
  def destroy
    @spot = Spot.find(params[:spot_id])
    @comment = @spot.comments.find(params[:id])
    @comment.destroy
    redirect_to(spot_path(@spot))
  end
end
