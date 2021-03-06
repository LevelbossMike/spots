# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100721085337) do

  create_table "comments", :force => true do |t|
    t.string   "commenter"
    t.text     "body"
    t.integer  "spot_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "rating"
    t.string   "title"
  end

  create_table "photos", :force => true do |t|
    t.integer  "spot_id"
    t.string   "data_file_name"
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.datetime "data_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
  end

  create_table "spots", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.decimal  "lat",               :precision => 15, :scale => 10
    t.decimal  "lng",               :precision => 15, :scale => 10
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "selected_photo_id"
  end

end
