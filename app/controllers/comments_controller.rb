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
  def edit
    @spot = Spot.find(params[:spot_id])
    @comment = Comment.find(params[:id])
  end
  def update
    @spot = Spot.find(params[:spot_id])
    @comment = Comment.find(params[:id])

    respond_to do |format|
      if @comment.update_attributes(params[:comment])
       format.html { redirect_to(@spot, :notice => 'Spot was successfully updated.') }
      else
       format.html { render :action => "edit" }
      end
    end
  end
end
