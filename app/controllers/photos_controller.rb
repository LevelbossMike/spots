class PhotosController < ApplicationController
  def destroy
    @spot = Spot.find(params[:spot_id])
    @photo = @spot.photos.find(params[:id])
    @photo.destroy
    redirect_to(spot_path(@spot))
  end
end
