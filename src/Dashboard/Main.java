package Dashboard;

import java.io.IOException;

import javax.swing.JFrame;
import Dashboard.VideoStreamPlayer;

public class Main {

    private JFrame frame = new JFrame();
    
    public Main() {
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);

        (new Thread(new VideoPlayerThread())).start();
    }
    
    private class VideoPlayerThread implements Runnable {

        public void run() {
            VideoStreamPlayer vsp = new VideoStreamPlayer();
            String[] args = {"/Users/kelvinabrokwa/hacku/astute-dev.github.io/video/stock.mp4"};
            try {
                vsp.init(args, Main.this.frame);
            }
            catch (InterruptedException e) { e.printStackTrace();}
            catch (IOException e) { e.printStackTrace(); }
        }
        
    }
    
    
    public static void main(String[]  args) {
        new Main();
    }

}
